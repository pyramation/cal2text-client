import React from "react";

import { AnchorButton, Button, ButtonGroup } from "@blueprintjs/core";

export const ButtonGroupExample = () => {
  return (
    <ButtonGroup style={{ minWidth: 200 }}>
      <Button icon="database">{"Queries"}</Button>
      <Button icon="function">{"Functions"}</Button>
      <AnchorButton icon="cog" rightIcon="settings">
        {"Options"}
      </AnchorButton>
    </ButtonGroup>
  );
};
