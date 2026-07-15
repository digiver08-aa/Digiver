"use client";

import { memo } from "react";

import {
  Clock3,
  History,
  MessageSquare,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Badge,
  Card,
  Skeleton,
  Stack,
} from "@/components/ui";

import { formatReputationDate } from "@/lib/reputation";
import { cn } from "@/lib/utils";

import type {
  ReputationEvent,
  ReputationHistoryListProps,
} from "@/types/reputation.types";

function getEventTitle(
  eventType: ReputationEvent["eventType"],
): string {
  switch (eventType) {
    case "REACTION_RECEIVED":
      return "Reaction Received";

    case "MESSAGE_PARTICIPATION":
      return "Message Participation";

    case "CIRCLE_PARTICIPATION":
      return "Circle Participation";

    default:
      return "Reputation Event";
  }
}

function getEventIcon(
  eventType: ReputationEvent["eventType"],
) {
  switch (eventType) {
    case "REACTION_RECEIVED":
      return (
        <Sparkles
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        />
      );

    case "MESSAGE_PARTICIPATION":
      return (
        <MessageSquare
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        />
      );

    case "CIRCLE_PARTICIPATION":
      return (
        <Users
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        />
      );

    default:
      return (
        <History
          className="h-4 w-4 text-accent"
          aria-hidden="true"
        />
      );
  }
}

function ReputationHistory({
  events,
  loading = false,
  emptyMessage = "No reputation activity yet.",
  className,
}: ReputationHistoryListProps) {
  if (loading) {
    return (
      <Card
        variant="glass"
        className={className}
        aria-busy="true"
        aria-live="polite"
      >
        <Stack gap="md">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-20 w-full"
            />
          ))}
        </Stack>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card
        variant="glass"
        className={className}
      >
        <Stack
          gap="md"
          className="items-center py-8 text-center"
        >
          <History
            className="h-10 w-10 text-accent/70"
            aria-hidden="true"
          />

          <Badge variant="muted">
            History
          </Badge>

          <div className="space-y-1">
            <h3 className="font-medium">
              No activity
            </h3>

            <p className="text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          </div>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      className={cn(className)}
    >
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="accent">
              History
            </Badge>

            <h2 className="mt-3 text-xl font-semibold">
              Reputation Activity
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Recent reputation events.
            </p>
          </div>

          <Badge variant="muted">
            {events.length}
          </Badge>
        </div>

        <div
          className="space-y-3"
          role="list"
        >
          {events.map((event) => (
            <article
              key={event.id}
              role="listitem"
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                p-4
                transition-colors
                hover:bg-white/10
              "
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      bg-accent/10
                    "
                  >
                    {getEventIcon(
                      event.eventType,
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {getEventTitle(
                        event.eventType,
                      )}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />

                      <time
                        dateTime={
                          event.createdAt
                        }
                      >
                        {formatReputationDate(
                          event.createdAt,
                        )}
                      </time>
                    </div>
                  </div>
                </div>

                <Badge variant="accent">
                  +
                  {event.scoreDelta}
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </Stack>
    </Card>
  );
}

export default memo(
  ReputationHistory,
);