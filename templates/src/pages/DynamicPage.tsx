import { useParams } from "react-router-dom";
import DynamicWidgetLayout from "../components/widgets/dynamicWidgetLayout";
import { useWidgetStore } from "../store/widgetStore";

const DynamicPage = () => {
  const { page } = useParams<{ page: string }>();
  const { widgets } = useWidgetStore();

  if (!page) return <p>No page specified</p>;

  if (!(page in widgets)) {
    return <div>404: Page "{page}" not found.</div>;
  }

  const pageWidgets = widgets[page];

  if (!pageWidgets) {
    return <p>No widgets configured for "{page}"</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 capitalize">{pageWidgets.name}</h1>
      <DynamicWidgetLayout pageInfo={pageWidgets} page={page} />
    </div>
  );
};

export default DynamicPage;
