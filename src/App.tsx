import { OmniForm } from "./components/OmniForm";

export default function App() {
  return (
    <div>
      <OmniForm
        fields={[
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            name: "photo_one",
            label: "Photo One",
            type: "file",
            fileType: "image",
            required: true,
          },
          {
            name: "file_one",
            label: "File One",
            type: "file",
            required: true,
          },
        ]}
      />
    </div>
  );
}
