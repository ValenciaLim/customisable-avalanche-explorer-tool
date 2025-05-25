import type { Page, PageInfo } from '../../store/widgetStore';
import { WidgetRenderer } from './widgetRenderer';

interface DynamicWidgetLayoutProps {
    pageInfo: PageInfo;
    page: Page | undefined;
}

export default function DynamicWidgetLayout({ pageInfo, page }: DynamicWidgetLayoutProps) {
  if (!pageInfo.widgets || pageInfo.widgets.length === 0) {
    return <p>No widgets selected.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pageInfo.widgets
        .filter((widget) => widget.visible)
        .map((widget) => (
            <div
            key={widget.type}
            className="bg-white shadow rounded-md p-4 relative"
            // optional: add drag & drop handlers here later
            >
            <WidgetRenderer type={widget.type} page={page} />
            </div>
        ))}
    </div>
  );
}
