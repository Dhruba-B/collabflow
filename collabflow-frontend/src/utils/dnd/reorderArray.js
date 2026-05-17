export const reorderArray = (items, fromIndex, toIndex) => {
    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);

    nextItems.splice(toIndex, 0, movedItem);

    return nextItems;
};

export const withSequentialPositions = (items) => {
    return items.map((item, index) => ({
        ...item,
        position: index + 1,
    }));
};
