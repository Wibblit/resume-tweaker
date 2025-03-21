import { Job } from "@/types/job-tracker";

const DB_NAME = "JobTrackerDB";
const STORE_NAME = "jobData";
const DB_VERSION = 2;

export class JobStorage {
  private static db: IDBDatabase | null = null;

  /**
   * Initializes and opens the IndexedDB database.
   * @returns A promise that resolves when the database is ready.
   */
  private static async openDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta");
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Stores an array of jobs in IndexedDB.
   */
  static async storeJobs(jobs: Job[]): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    jobs.forEach((job) => store.put(job));

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Adds a single job to IndexedDB.
   */
  static async addJob(job: Job): Promise<void> {
    return this.storeJobs([job]);
  }

  /**
   * Updates a single job in IndexedDB.
   */
  static async updateJob(job: Job): Promise<void> {
    return this.storeJobs([job]);
  }

  /**
   * Retrieves all stored jobs from IndexedDB.
   */
  static async getJobs(): Promise<Job[]> {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Replaces all stored jobs in IndexedDB.
   */
  static async replaceJobs(jobs: Job[]): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.clear();
    jobs.forEach((job) => store.put(job));

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Deletes a job from IndexedDB by ID.
   */
  static async deleteJob(jobId: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.delete(jobId);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  /**
   * Clears all job data from IndexedDB.
   */
  static async clearJobs(): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  static async setLastSync(date: Date): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction("meta", "readwrite");
    const store = tx.objectStore("meta");
    store.put(date.toISOString(), "lastSync");

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  static async getLastSync(): Promise<Date | null> {
    const db = await this.openDB();
    const tx = db.transaction("meta", "readonly");
    const store = tx.objectStore("meta");

    return new Promise((resolve, reject) => {
      const req = store.get("lastSync");
      req.onsuccess = () => {
        if (req.result) {
          resolve(new Date(req.result));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }
}
