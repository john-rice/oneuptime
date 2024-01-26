import { Green } from 'Common/Types/BrandColors';
import Color from 'Common/Types/Color';
import OneUptimeDate from 'Common/Types/Date';
import Dictionary from 'Common/Types/Dictionary';
import React, {
    FunctionComponent,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import Tooltip from '../Tooltip/Tooltip';
import ObjectID from 'Common/Types/ObjectID';

export interface Event {
    startDate: Date;
    endDate: Date;
    label: string;
    priority: number;
    color: Color;
    eventStatusId: ObjectID; // this is the id of the event status. for example, monitor status id.
}

export interface BarChartRule {
    barColor: Color;
    uptimePercentGreaterThanOrEqualTo: number;
}

export interface ComponentProps {
    startDate: Date;
    endDate: Date;
    events: Array<Event>;
    defaultLabel: string;
    height?: number | undefined;
    barColorRules?: Array<BarChartRule> | undefined;
    downtimeEventStatusIds?: Array<ObjectID> | undefined;
}

const DayUptimeGraph: FunctionComponent<ComponentProps> = (
    props: ComponentProps
): ReactElement => {
    const [days, setDays] = useState<number>(0);

    useEffect(() => {
        setDays(
            OneUptimeDate.getNumberOfDaysBetweenDatesInclusive(
                props.startDate,
                props.endDate
            )
        );
    }, [props.startDate, props.endDate]);

    const getUptimeBar: Function = (dayNumber: number): ReactElement => {
        let color: Color = Green;

        const todaysDay: Date = OneUptimeDate.getSomeDaysAfterDate(
            props.startDate,
            dayNumber
        );

        let toolTipText: string = `${OneUptimeDate.getDateAsLocalFormattedString(
            todaysDay,
            true
        )}`;

        const startOfTheDay: Date = OneUptimeDate.getStartOfDay(todaysDay);
        const endOfTheDay: Date = OneUptimeDate.getEndOfDay(todaysDay);

        const todaysEvents: Array<Event> = props.events.filter(
            (event: Event) => {
                let doesEventBelongsToToday: boolean = false;

                /// if the event starts or end today.
                if (
                    OneUptimeDate.isBetween(
                        event.startDate,
                        startOfTheDay,
                        endOfTheDay
                    )
                ) {
                    doesEventBelongsToToday = true;
                }

                if (
                    OneUptimeDate.isBetween(
                        event.endDate,
                        startOfTheDay,
                        endOfTheDay
                    )
                ) {
                    doesEventBelongsToToday = true;
                }

                // if the event is outside start or end day but overlaps the day completely.

                if (
                    OneUptimeDate.isBetween(
                        startOfTheDay,
                        event.startDate,
                        endOfTheDay
                    ) &&
                    OneUptimeDate.isBetween(
                        endOfTheDay,
                        startOfTheDay,
                        event.endDate
                    )
                ) {
                    doesEventBelongsToToday = true;
                }

                return doesEventBelongsToToday;
            }
        );

        const secondsOfEvent: Dictionary<number> = {};

        let currentPriority: number = 1;

        for (const event of todaysEvents) {
            const startDate: Date = OneUptimeDate.getGreaterDate(
                event.startDate,
                startOfTheDay
            );
            const endDate: Date = OneUptimeDate.getLesserDate(
                event.endDate,
                OneUptimeDate.getLesserDate(
                    OneUptimeDate.getCurrentDate(),
                    endOfTheDay
                )
            );

            const seconds: number = OneUptimeDate.getSecondsBetweenDates(
                startDate,
                endDate
            );

            if (!secondsOfEvent[event.eventStatusId.toString()]) {
                secondsOfEvent[event.eventStatusId.toString()] = 0;
            }

            secondsOfEvent[event.eventStatusId.toString()] += seconds;

            // set bar color.
            if (currentPriority <= event.priority) {
                currentPriority = event.priority;
                color = event.color;
            }
        }

        let hasText: boolean = false;

        let totalUptimeInSecondsInDayBasedOnBarRules: number =
            OneUptimeDate.getSecondsBetweenDates(startOfTheDay, endOfTheDay);

        for (const key in secondsOfEvent) {
            if (todaysEvents.length === 1) {
                break;
            }

            hasText = true;
            toolTipText += `, ${key} for ${OneUptimeDate.secondsToFormattedFriendlyTimeString(
                secondsOfEvent[key] || 0
            )}`;

            // TODO: Add rules here.

            const eventStatusId: string = key;

            const isDowntimeEvent: boolean = Boolean(
                props.downtimeEventStatusIds?.find((id: ObjectID) => {
                    return id.toString() === eventStatusId;
                })
            );

            if (isDowntimeEvent) {
                // remove the seconds from total uptime.
                const secondsOfDowntime: number = secondsOfEvent[key] || 0;
                totalUptimeInSecondsInDayBasedOnBarRules -= secondsOfDowntime;
            }
        }

        // now check bar rules and finalize the color of the bar.

        const totalSecondsForTheDay: number =
            OneUptimeDate.getSecondsBetweenDates(startOfTheDay, endOfTheDay);

        const uptimePercentForTheDay: number =
            (totalUptimeInSecondsInDayBasedOnBarRules / totalSecondsForTheDay) *
            100;

        for (const rules of props.barColorRules || []) {
            if (
                uptimePercentForTheDay >=
                rules.uptimePercentGreaterThanOrEqualTo
            ) {
                color = rules.barColor;
                break;
            }
        }

        if (todaysEvents.length === 1) {
            hasText = true;
            toolTipText += ` - 100% ${
                todaysEvents[0]?.label || 'Operational'
            }.`;
        }

        if (!hasText) {
            toolTipText += ` - 100% ${props.defaultLabel || 'Operational'}.`;
        }

        let className: string = 'h-20 w-20';

        if (props.height) {
            className = 'w-20 h-' + props.height;
        }
        return (
            <Tooltip key={dayNumber} text={toolTipText || '100% Operational'}>
                <div
                    className={className}
                    style={{
                        backgroundColor: color.toString(),
                    }}
                ></div>
            </Tooltip>
        );
    };

    const getUptimeGraph: Function = (): Array<ReactElement> => {
        const elements: Array<ReactElement> = [];

        for (let i: number = 0; i < days; i++) {
            elements.push(getUptimeBar(i));
        }

        return elements;
    };

    return (
        <div className="flex space-x-0.5 rounded overflow-hidden">
            {getUptimeGraph()}
        </div>
    );
};

export default DayUptimeGraph;
