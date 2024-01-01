import { TrashIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

interface ClearScreenProps {
    onClick: () => void
}

export default function ClearScreen({ onClick }: ClearScreenProps) {
  return (
    <div className="tool-primary">
      <IconButton
        variant="gradient"
        className="tool-button"
        onClick={onClick}
      >
        <TrashIcon className="tool-icon"/>
      </IconButton>
    </div>
  );
}
