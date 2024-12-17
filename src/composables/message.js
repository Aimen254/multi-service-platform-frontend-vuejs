
export const useMessage = () => {
    const dataNotFound = 'There are no database entries that meet your criteria.'


    // get message
    const recordNotFound = () => {
        return dataNotFound;
    }

    return {
        recordNotFound
    }
}