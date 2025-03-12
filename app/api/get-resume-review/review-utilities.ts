import { grammerPrompt } from "@/data/prompts/reportPrompts/grammarPrompt";
import { impactPrompt } from "@/data/prompts/reportPrompts/impactPrompt";
import { mergePrompt } from "@/data/prompts/reportPrompts/mergePrompt";
import { readabilityClarityPrompt } from "@/data/prompts/reportPrompts/readclarityPrompt";
import { relevancePrompt } from "@/data/prompts/reportPrompts/relevancePrompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { result } from "lodash";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Issue = {
  name: string;
  severity: string;
};

type Metric = {
  type: string;
  score: number;
  issues: Issue[];
};

type StageResult = {
  selector: string;
  metrics: Metric[];
  correction_logic: string;
  final_output: string;
};

type TransformedResult = {
  selector: string;
  proposed_changes: {
    type: string;
    correction_logic: string;
    final_output: string;
  }[];
};

type MergedResult = {
  result: {
    selector: string;
    final_output: string;
    correction_logic: string;
    metrics?: Metric[];
  }[];
};


function transformData(input: StageResult[]): { transformed: TransformedResult[]; uniqueSelectors: string[] } {
  const outputMap = new Map<string, any>();
  const selectorCount = new Map<string, number>();

  input.forEach((entry: { selector: string; metrics: { type: any }[]; correction_logic: any; final_output: any }) => {
    const selector = entry.selector;

    const change = {
      type: entry.metrics[0]?.type,
      correction_logic: entry.correction_logic,
      final_output: entry.final_output
    };

    if (!outputMap.has(selector)) {
      outputMap.set(selector, {
        selector,
        proposed_changes: [change]
      });
      selectorCount.set(selector, 1);
    } else {
      outputMap.get(selector).proposed_changes.push(change);
      selectorCount.set(selector, (selectorCount.get(selector) || 0) + 1);
    }
  });

  const transformed = Array.from(outputMap.entries())
    .filter(([selector]) => selectorCount.get(selector)! > 1)
    .map(([_, value]) => value);

  const uniqueSelectors = Array.from(selectorCount.entries())
    .filter(([_, count]) => count === 1)
    .map(([selector]) => selector);

  return {
    transformed,
    uniqueSelectors
  };
}


function mergeMetrics(stageResults: StageResult[], transformed: TransformedResult[], mergedJson: MergedResult): MergedResult {
  const metricsMap = new Map<string, { type: string; score: number; issues: { name: string; severity: string }[] }[]>();

  // Collect and merge metrics for each selector
  transformed.forEach(({ selector }) => {
    const matchingResults = stageResults.filter((result) => result.selector === selector);

    if (matchingResults.length > 0) {
      const mergedMetrics = matchingResults.flatMap((result) => result.metrics);
      metricsMap.set(selector, mergedMetrics);
    }
  });

  // Insert merged metrics into the mergedJson
  const updatedResult = mergedJson.result.map((item) => {
    if (metricsMap.has(item.selector)) {
      return {
        ...item,
        metrics: metricsMap.get(item.selector),
      };
    }
    return item;
  });

  return { result: updatedResult };
}

function syncStageResultsWithMerged(stageResults: StageResult[], mergedResult: MergedResult): StageResult[] {

  const mergedSelectors = new Set(mergedResult.result.map(item => item.selector));

  // Remove all entries from stageResults that exist in mergedResult
  const filteredStageResults = stageResults.filter(result => !mergedSelectors.has(result.selector));

  // Add the merged result entries
  const updatedStageResults = [
    ...filteredStageResults,
    ...mergedResult.result.map(item => ({
      selector: item.selector,
      metrics: item.metrics || [],
      correction_logic: item.correction_logic || '',
      final_output: item.final_output
    }))
  ];

  return updatedStageResults;
}

export const executeStagesSequentially = async (stagePrompts: string[], stageName: string[]) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const stageResults: StageResult[] = [];
  let tokensused: {stagename:string, promptTokensUsed:number, candidateTokensUsed:number,totalTokensUsed:number }[] = []
  for (let i = 0; i < stagePrompts.length; i++) {
    const prompt = `${stagePrompts[i]}`;
    const name = stageName[i]
    const response = await model.generateContent(prompt);
    const text = response.response.text().replace(/```json\s*|\s*```/g, "").trim();
    var tokendata = response.response.usageMetadata
    tokensused.push({
      candidateTokensUsed: tokendata?.candidatesTokenCount ?? 0,
      promptTokensUsed: tokendata?.promptTokenCount ?? 0,
      totalTokensUsed:tokendata?.totalTokenCount ?? 0,
      stagename: name,
    })
    const jsontext = JSON.parse(text)
    console.log(`${name} check completed`)
    // console.log(jsontext.results)
    stageResults.push(...jsontext.results);

  }
  const cleaned = transformData(stageResults)
  return {
    stageres: stageResults,
    tomerge: cleaned.transformed,
    nottomerge: cleaned.uniqueSelectors,
    tokeninfo: tokensused
  }
};
//TODO
//make changes
export const resumeReview = async (resume: string, jd: string, reviewType: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let stagespromptlist = []
  if (reviewType == 'generic'){
    stagespromptlist = [grammerPrompt(resume),readabilityClarityPrompt(resume),impactPrompt(resume)]
  }
  else {
    stagespromptlist = [grammerPrompt(resume),readabilityClarityPrompt(resume),impactPrompt(resume),relevancePrompt(resume,jd)]
  }
  const stageNames = ["grammer","readabilityClarity", "impact", "relevance"]
  const stageresults = await executeStagesSequentially(stagespromptlist, stageNames)
  let tokensinfo = stageresults.tokeninfo
  var finalText = ''
  if (stageresults.tomerge.length >= 1) {
    
    const conflictMergePrompt = mergePrompt(JSON.stringify({results:stageresults.tomerge}))
    console.log("Finding and merging conflicts")
    const response = await model.generateContent(conflictMergePrompt);
    finalText = response.response.text().replace(/```json\s*|\s*```/g, "").trim();
    const mergejson = JSON.parse(finalText)
    console.log('parsed merge')
    const mergedmetricsjson = mergeMetrics(stageresults.stageres,stageresults.tomerge,mergejson)
    console.log('merged metrics')
    const finalStageResults = syncStageResultsWithMerged(stageresults.stageres,mergedmetricsjson)
    console.log('final result ready')
    var tokendata = response.response.usageMetadata
    tokensinfo.push({
      candidateTokensUsed: tokendata?.candidatesTokenCount ?? 0,
      promptTokensUsed: tokendata?.promptTokenCount ?? 0,
      totalTokensUsed:tokendata?.totalTokenCount ?? 0,
      stagename: "merge",
    })
    const totaltokens = tokensinfo.reduce(
      (acc, curr) => {
        acc.candidateTokensUsed += curr.candidateTokensUsed;
        acc.promptTokensUsed += curr.promptTokensUsed;
        acc.totalTokensUsed += curr.totalTokensUsed;
        return acc;
      },
      { candidateTokensUsed: 0, promptTokensUsed: 0, totalTokensUsed: 0 }
    );
    tokensinfo.push({
      ...totaltokens,
      stagename: "total",
    });
    
    return { finalStageResults ,tokensinfo};
  }
  if (stageresults.tomerge.length === 0){
    const finalStageResults = stageresults.stageres
    const totaltokens = tokensinfo.reduce(
      (acc, curr) => {
        acc.candidateTokensUsed += curr.candidateTokensUsed;
        acc.promptTokensUsed += curr.promptTokensUsed;
        acc.totalTokensUsed += curr.totalTokensUsed;
        return acc;
      },
      { candidateTokensUsed: 0, promptTokensUsed: 0, totalTokensUsed: 0 }
    );
    tokensinfo.push({
      ...totaltokens,
      stagename: "total",
    });
    return {finalStageResults,tokensinfo}
  }
};

