export const DBConfig = {
  name: "MyDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "anime",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "airingIDX", keypath: "airing", options: { unique: false } },
        { name: "startDateIDX", keypath: "start_date", options: { unique: false } },
        { name: "broadccastIdx", keypath: "broadcast", options: { unique: false } },
      ],
    },
    {
      store: "season",
      storeConfig: { keyPath: "id", autoIncrement: false },
      storeSchema: [
        { name: "airingIDX", keypath: "airing", options: { unique: false } },
        { name: "startDateIDX", keypath: "start_date", options: { unique: false } },
        { name: "broadccastIdx", keypath: "broadcast", options: { unique: false } },
      ],
    }
  ],
};