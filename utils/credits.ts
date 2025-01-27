// Create a new Map to store credit requirements
export const creditList = new Map<string, number | Map<string, number>>();

creditList.set("adaptive", 30);
creditList.set("comprehensive", 20);
creditList.set("aigenerate", 1);
creditList.set("aienhance", 1);
creditList.set("resumeslot", 50);
creditList.set("coverslot", 50);
creditList.set("tailored", 10);
creditList.set("generic", 5);
