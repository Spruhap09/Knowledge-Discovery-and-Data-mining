import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";

interface DownloadImageProps {
    onClick: () => void
}
export default function DownloadImage({ onClick }: DownloadImageProps) {
    return (
        <div className="tool-primary">
          <IconButton
            variant="gradient"
            className="tool-button"
            onClick={onClick}
          >
            <ArrowDownCircleIcon className="tool-icon"/>
          </IconButton>
        </div>
      );
}