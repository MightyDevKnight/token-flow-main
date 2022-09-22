import React from "react";
import * as Switch from '@radix-ui/react-switch';
  
const ToggleSwitch = ({ label }) => {
  return (
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
  );
};
  
export default ToggleSwitch;