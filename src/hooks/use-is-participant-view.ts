import {useSearchParams} from "next/navigation";
import {eventPageQueryParams} from "@/config/query-params";

export const useIsParticipantView = () => {
    const params = useSearchParams();

    return params.get(eventPageQueryParams.asParticipant) === "true";
};
