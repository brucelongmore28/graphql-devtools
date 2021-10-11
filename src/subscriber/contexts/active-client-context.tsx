import React, { useState, useContext } from "react";
import { Loader, FormDropdown } from "@fluentui/react-northstar";

import { ApolloTrackerData } from "../../types";
import { ApolloTrackerContextData } from "../types";
import { ApolloTrackerContext } from "./apollo-tracker-context";

export function getActiveClientData(
  apolloTrackerData: ApolloTrackerContextData[],
  activeClientId: string
) {
  return apolloTrackerData.find(
    ({ clientId }: ApolloTrackerContextData) => clientId === activeClientId
  ) as ApolloTrackerContextData;
}

export const ActiveClientContext = React.createContext("");

export const ActiveClientContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [activeClientId, setActiveClientId] = useState<string>("");
  const apolloTrackerData = useContext(ApolloTrackerContext);

  const dropdownValues = apolloTrackerData.map(
    (clientObject: ApolloTrackerData) => clientObject.clientId
  );

  const onChange = (_: any, { value }: any) => {
    setActiveClientId(value);
  };

  if (!activeClientId && dropdownValues.length) {
    setActiveClientId(dropdownValues[0]);
  }

  return (
    <>
      <FormDropdown
        label={{
          content: `Choose apollo client:`,
        }}
        items={dropdownValues}
        onChange={onChange}
        value={activeClientId}
        placeholder="Choose a apollo client"
      />
      {activeClientId ? (
        <ActiveClientContext.Provider value={activeClientId}>
          {children}
        </ActiveClientContext.Provider>
      ) : (
        <Loader />
      )}
    </>
  );
};
