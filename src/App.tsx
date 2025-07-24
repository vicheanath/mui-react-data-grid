// App.tsx
import React from "react";
import type { DataRow } from "./types";
import DataSheet from "./DataSheet";

function getRandomName(i: number) {
  const firstNames = [
    "John",
    "Jane",
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Ethan",
    "Fiona",
    "George",
    "Hannah",
    "Ivan",
    "Julia",
    "Kevin",
    "Laura",
    "Mike",
    "Nina",
    "Oscar",
    "Paula",
    "Quinn",
    "Rita",
  ];
  const lastNames = [
    "Doe",
    "Smith",
    "Johnson",
    "Lee",
    "Kim",
    "Ross",
    "Hunt",
    "Glenanne",
    "Clooney",
    "Brown",
    "Miller",
    "Davis",
    "Wilson",
    "Moore",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White",
    "Harris",
  ];
  return `${firstNames[i % firstNames.length]} ${
    lastNames[i % lastNames.length]
  }`;
}

function getRandomStatus(i: number) {
  const statuses = ["active", "inactive", "pending"] as const;
  return statuses[i % statuses.length];
}

const initialData: DataRow[] = Array.from({ length: 100 }, (_, i) => {
  const id = (i + 1).toString();
  const name = getRandomName(i);
  const age = 20 + (i % 40);
  const email = `${name.toLowerCase().replace(/ /g, "_")}@example.com`;
  const money = Math.round((Math.random() * 10000000000 + i * 10) * 100) / 100;
  return { id, name, age, email, money };
});

const App: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Data Sheet</h1>
      <DataSheet initialData={initialData} />
    </div>
  );
};

export default App;
