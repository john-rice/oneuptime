import OneUptimeDate from "Common/Types/Date";
import CustomCodeMonitorResponse from "Common/Types/Monitor/CustomCodeMonitor/CustomCodeMonitorResponse";
import Button, { ButtonStyleType } from "CommonUI/src/Components/Button/Button";
import Detail from "CommonUI/src/Components/Detail/Detail";
import Field from "CommonUI/src/Components/Detail/Field";
import ErrorMessage from "CommonUI/src/Components/ErrorMessage/ErrorMessage";
import InfoCard from "CommonUI/src/Components/InfoCard/InfoCard";
import FieldType from "CommonUI/src/Components/Types/FieldType";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  customCodeMonitorResponse: CustomCodeMonitorResponse;
  moreDetailElement?: ReactElement;
  monitoredAt: Date;
}

const CustomCodeMonitorSummaryView: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  if (!props.customCodeMonitorResponse) {
    return (
      <ErrorMessage error="No summary available for the selected probe. Should be few minutes for summary to show up. " />
    );
  }

  const [showMoreDetails, setShowMoreDetails] = React.useState<boolean>(false);

  const customMonitorResponse: CustomCodeMonitorResponse =
    props.customCodeMonitorResponse;

  let executionTimeInMS: number = customMonitorResponse.executionTimeInMS || 0;

  if (executionTimeInMS > 0) {
    executionTimeInMS = Math.round(executionTimeInMS);
  }

  const fields: Array<Field<CustomCodeMonitorResponse>> = [];

  if (
    customMonitorResponse.logMessages &&
    customMonitorResponse.logMessages.length > 0
  ) {
    fields.push({
      key: "logMessages",
      title: "Log Messages",
      description: "Log messages from the script execution.",
      fieldType: FieldType.JSON,
    });
  }

  if (customMonitorResponse.result) {
    fields.push({
      key: "result",
      title: "Result",
      description: "Result of the script execution.",
      fieldType: FieldType.JSON,
    });
  }

  if (customMonitorResponse.scriptError) {
    fields.push({
      key: "scriptError",
      title: "Script Error",
      description: "Error message from script execution.",
      fieldType: FieldType.Text,
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div className="flex space-x-3 w-full">
          <InfoCard
            className="w-1/3 shadow-none border-2 border-gray-100 "
            title="Execution Time (in ms)"
            value={executionTimeInMS ? executionTimeInMS + " ms" : "-"}
          />

          <InfoCard
            className="w-1/3 shadow-none border-2 border-gray-100 "
            title="Error"
            value={customMonitorResponse.scriptError ? "Yes" : "No"}
          />

          <InfoCard
            className="w-1/3 shadow-none border-2 border-gray-100 "
            title="Monitored At"
            value={
              props.monitoredAt
                ? OneUptimeDate.getDateAsLocalFormattedString(props.monitoredAt)
                : "-"
            }
          />
        </div>

        {showMoreDetails && (
          <div>
            <Detail<CustomCodeMonitorResponse>
              id={"custom-code-monitor-summary-detail"}
              item={customMonitorResponse}
              fields={fields}
              showDetailsInNumberOfColumns={1}
            />

            {props.moreDetailElement && props.moreDetailElement}
          </div>
        )}

        {!showMoreDetails && (
          <div className="-ml-2">
            <Button
              buttonStyle={ButtonStyleType.SECONDARY_LINK}
              title="Show More Details"
              onClick={() => {
                return setShowMoreDetails(true);
              }}
            />
          </div>
        )}

        {/* Hide details button */}

        {showMoreDetails && (
          <div className="-ml-2">
            <Button
              buttonStyle={ButtonStyleType.SECONDARY_LINK}
              title="Hide Details"
              onClick={() => {
                return setShowMoreDetails(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCodeMonitorSummaryView;
