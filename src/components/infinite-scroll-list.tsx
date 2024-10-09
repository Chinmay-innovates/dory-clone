import {Dispatch, SetStateAction, useState} from "react";
import {useInView} from "react-intersection-observer";
import {Loader} from "lucide-react";

type Props<T extends { id: any }> = {
    items: T[];
    setItems: Dispatch<SetStateAction<T[]>>;
    renderItem: (item: T) => Element;
    fetchMore: (args: { cursor?: any }) => Promise<T[]>;
};

export const InfiniteScrollList =
    <T extends { id: any }>({items, setItems, fetchMore, renderItem,}: Props<T>) => {
        const [cursor, setCursor] = useState(items.at(-1)?.id);

        const [hasMoreData, setHasMoreData] = useState(true);

        const loadMore = async () => {
            const newItems = await fetchMore({
                cursor,
            });

            if (newItems.length === 0) {
                setHasMoreData(false);
                return;
            }

            setItems((prevItems) => [...prevItems, ...newItems]);
            setCursor(newItems.at(-1)?.id);
        };

        const {ref: scrollTrigger} = useInView({
            threshold: 0,
            onChange: (inView) => {
                if (inView && hasMoreData) {
                    loadMore()
                        .then(() => {
                            console.log('More data loaded successfully');
                        })
                        .catch((error) => {
                            console.error('Failed to load more data:', error);
                        });
                }
            },
        });


        return (
            <>
                {items.map((item) => renderItem(item))}

                {hasMoreData && (
                    <div ref={scrollTrigger} className="h-full w-full flex items-center justify-center">
                        <Loader
                            className="animate-spin  w-full text-muted-foreground flex items-center justify-center ml-auto"
                            width={30} height={30}/>
                    </div>
                )}
            </>
        );
    };
