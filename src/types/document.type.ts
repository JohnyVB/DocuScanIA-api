export interface PeopleMentioned {
  name: string;
  role: string;
}

export interface ImportantDate {
  date: string;
  description: string;
}

export type DocumentData = {
  document_type: string;
  category: string;
  summary: string;
  people_mentioned: PeopleMentioned[];
  important_dates: ImportantDate[];
  document_number: string;
  address: string;
  requires_action: boolean;
  recommended_action: string;
  importance_level: string;
};

export type DocumenTypes = {
  firestoreId: string;
  ownerId: string;
  imagesUri: string[];
  createdAt: string;
  show: boolean;
  data: DocumentData;
};
