import { useWidgetStore, type Page } from '../../store/widgetStore';
import { widgetComponentMap, type WidgetType } from './widgetConfig';

// Shared component map for widget types
const componentMap = widgetComponentMap;

export const WidgetRenderer = ({
  type,
  page,
}: {
  type: WidgetType;
  page: Page;
}) => {
  const { toggleWidgetVisibility } = useWidgetStore();
  const Component = componentMap[type];

  if (!Component) return null;

  return (
    <div className="relative p-4 bg-white">
      <div
        role='button'
        className="absolute top-1 right-2 text-red-500 z-50 cursor-pointer"
        onClick={() => toggleWidgetVisibility(page, type)}
      >
        ✕
      </div>
      <Component />
    </div>
  );
};
