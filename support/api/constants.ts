export const ObjectTypeKeys = {
  page: "ot-page",
  set: "ot-set",
  space: "ot-space",
  template: "ot-template",
  type: "ot-objectType",
  image: "ot-image",
  file: "ot-file",
  video: "ot-video",
  audio: "ot-audio",
  relation: "ot-relation",
  note: "ot-note",
  task: "ot-task",
  bookmark: "ot-bookmark",
  option: "ot-relationOption",
  collection: "ot-collection",
  dashboard: "ot-dashboard",
  date: "ot-date",
  profile: "ot-profile",
  chat: "ot-chat",
} as const;

// Type for the object keys
export type ObjectTypeKey = keyof typeof ObjectTypeKeys;

// Type for the object values
export type ObjectTypeValue = (typeof ObjectTypeKeys)[ObjectTypeKey];
