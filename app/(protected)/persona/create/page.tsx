import { PersonaCreateForm } from "./components/PersonaCreateForm";

export default function PersonaCreatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Persona</h1>

        <p className="mt-2 text-muted-foreground">
          Create your digital identity within Digiver.
        </p>
      </div>

      <PersonaCreateForm />
    </div>
  );
}