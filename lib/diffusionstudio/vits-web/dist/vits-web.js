const u = "/models"; // Path to your models in the public directory
const B = "https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.18.0/";
const x = "https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize";

const c = {
  "en_US-hfc_male-medium": "/en_US-hfc_male-medium.onnx", // Direct .onnx file
};

async function D(e) {
  try {
    const response = await fetch(e);
    if (!response.ok) throw new Error(`Failed to fetch model: ${e}`);
    return await response.blob(); // Return the model as a Blob
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Missing audio processing function 'b' to handle audio buffer output
function b(data, channels, sampleRate) {
  const bufferLength = data.length * channels * 2 + 44;
  const buffer = new DataView(new ArrayBuffer(bufferLength));
  buffer.setUint32(0, 1179011410, true); // 'RIFF'
  buffer.setUint32(4, bufferLength - 8, true);
  buffer.setUint32(8, 1163280727, true); // 'WAVE'
  buffer.setUint32(12, 544501094, true); // 'fmt '
  buffer.setUint32(16, 16, true); // PCM header size
  buffer.setUint16(20, 1, true); // Format code: PCM
  buffer.setUint16(22, channels, true);
  buffer.setUint32(24, sampleRate, true);
  buffer.setUint32(28, sampleRate * channels * 2, true);
  buffer.setUint16(32, channels * 2, true);
  buffer.setUint16(34, 16, true); // Bits per sample
  buffer.setUint32(36, 1635017060, true); // 'data'
  buffer.setUint32(40, data.length * channels * 2, true);
  
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const value = Math.max(-1, Math.min(1, data[i])) * 32767;
    buffer.setInt16(offset, value < 0 ? value : value | 0, true);
    offset += 2;
  }
  
  return buffer.buffer;
}

let h, _;
async function N(e, m) {
  try {
    if (!h) h = await import("./piper-DeOu3H9E.js");
    if (!_) _ = await import("onnxruntime-web");

    const n = c[e.voiceId];
    const o = JSON.stringify([{ text: e.text.trim() }]);

    _.env.allowLocalModels = false;
    _.env.wasm.numThreads = navigator.hardwareConcurrency;
    _.env.wasm.wasmPaths = B;

    const t = await new Promise(async (resolve, reject) => {
      const phonemizeInstance = await h.createPiperPhonemize({
        print: (log) => resolve(JSON.parse(log).phoneme_ids),
        printErr: (error) => reject(new Error(error)),
        locateFile: (file) =>
          file.endsWith(".wasm") ? `${x}.wasm` : file.endsWith(".data") ? `${x}.data` : file,
      });
      phonemizeInstance.callMain(["-l", "en", "--input", o, "--espeak_data", "/espeak-ng-data"]);
    });

    const modelBlob = await D(`${u}${n}`);
    const modelBuffer = await modelBlob.arrayBuffer();
    const session = await _.InferenceSession.create(modelBuffer);

    // Set default `scales` values, as there’s no .json metadata
    const scales = new _.Tensor("float32", [0.667, 1.0, 0.8]);

    const inputs = {
      input: new _.Tensor("int64", t, [1, t.length]),
      input_lengths: new _.Tensor("int64", [t.length]),
      scales,
    };

    const result = await session.run(inputs);
    return new Blob([b(result.output.data, 1, 22050)], { type: "audio/x-wav" });

  } catch (error) {
    console.error("Error generating TTS:", error);
    throw error;
  }
}

// Export functions as needed
export {
  u as HF_BASE,
  B as ONNX_BASE,
  c as PATH_MAP,
  x as WASM_BASE,
  N as predict,
};
