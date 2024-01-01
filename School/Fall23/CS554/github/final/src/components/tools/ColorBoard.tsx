import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { SwatchIcon } from "@heroicons/react/24/outline";
import {
  IconButton,
  SpeedDial,
  SpeedDialContent,
  SpeedDialHandler,
} from "@material-tailwind/react";

interface ColorBoardProps {
    color: string;
    setColor: (color: string) => void;
  }

export default function ColorBoardProps({ color, setColor }: ColorBoardProps) {
    return (
        <div className="tool-primary">
            <SpeedDial placement="top">
            <SpeedDialHandler>
                <IconButton variant="gradient" className="tool-button">
                <SwatchIcon className="tool-icon" />
                </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent>
                <SketchPicker color={color} onChange={(e) => setColor(e.hex)}/>
            </SpeedDialContent>
            </SpeedDial>
        </div>
    );
}