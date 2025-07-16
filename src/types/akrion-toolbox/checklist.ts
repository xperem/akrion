export type ChecklistItem = {
  id: string;              // ex. "1.1.1.a"
  title: string;
  description: string;
  regulationRef: string;
};

export type ChecklistSection = {
  id: string;              // ex. "1"
  title: string;
  items: ChecklistItem[];
};

export type Checklist = {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: ChecklistSection[];
};
