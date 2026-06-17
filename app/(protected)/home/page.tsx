import { FeedComposer } from "./components/FeedComposer";
import { FeedHeader } from "./components/FeedHeader";
import { FeedList } from "./components/FeedList";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <FeedHeader />

      <FeedComposer />

      <FeedList />
    </main>
  );
}