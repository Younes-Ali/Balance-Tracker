import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";

export default function AboutPage() {
  return (
    <div>
      <PageHeader title="About Raheeq" subtitle="The story and the tool behind it" />
      <Card className="mb-4 p-6 text-center">
        <img
          src={`${import.meta.env.BASE_URL}raheeq_logo.jpg`}
          alt="Raheeq Honey"
          className="mx-auto mb-4 w-56 max-w-full rounded-xl"
        />
        <h2 className="font-serif text-2xl font-bold text-ink">Raheeq Honey</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Pure, small-batch honey - sourced responsibly and delivered to shops, supermarkets and wholesale clients who
          trust the Raheeq name.
        </p>
      </Card>
      <Card className="p-5">
        <h3 className="mb-2 font-serif text-base font-bold text-ink">About this tool</h3>
        <p className="text-sm text-ink-soft">
          Balance Tracker keeps a running ledger for every client - what they have taken, what they have paid and what
          is still owed - together with Vodafone Cash inflows and expenses and your online shop orders. It reads and
          writes the same Google Sheet as the desktop app, so a change made on your phone shows up on your PC and the
          other way round.
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          Tip: on your phone, open the browser menu and choose "Add to Home Screen" to use it like an app.
        </p>
      </Card>
    </div>
  );
}
