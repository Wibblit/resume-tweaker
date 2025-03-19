import { Job } from "@/types/job-tracker";
import { JobStorage } from "./JobStorage";

const EXTENSION_ID =
  process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID ||
  "bdginglpipmmlnfkoikphljipmhalbkf";

export class ExtensionCommunicator {
  private static sendMessage<T>(message: any): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        message,
        { includeTlsChannelId: true },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Chrome Extension Error:",
              chrome.runtime.lastError.message
            );
            reject(new Error(chrome.runtime.lastError.message));
          } else if (response?.success) {
            resolve(response);
          } else {
            console.error("Unexpected Response:", response);
            reject(new Error("Unexpected response from Chrome extension."));
          }
        }
      );
    });
  }

  static async updateIndexDB(): Promise<{ isChanged: boolean; data: Job[] }> {
    try {
      const response = await this.sendMessage<{
        success: boolean;
        data: Job[];
        isChanged: boolean;
      }>({ type: "GET_ALL_JOBS" });

      console.log("Jobs fetched successfully.", response.data, response);
      if (response.isChanged) {
        await JobStorage.storeJobs(response.data);
        console.log("Extension data updated in IndexDB");
        await this.unsetIsChanged();
      }
      return { data: response.data, isChanged: response.isChanged };
    } catch (error) {
      console.error("Failed to get jobs:", error);
      return { isChanged: false, data: [] };
    }
  }

  static async unsetIsChanged(): Promise<{ success: boolean }> {
    return this.sendMessage<{ success: boolean }>({ type: "UNSET_ISCHANGED" });
  }

  static async updateChanges(jobs: Job[]): Promise<{ success: boolean }> {
    return this.sendMessage<{ success: boolean }>({
      type: "UPDATE_CHANGES",
      data: jobs,
    });
  }

  static async clearExtensionStorage(): Promise<{ success: boolean }> {
    return this.sendMessage({
      type: "CLEAR_STORAGE",
    });
  }
}
