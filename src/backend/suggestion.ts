import axis from "axios";

const getSuggestion = async (keyword:string) => {
    try {
        const resp = await axis.post(import.meta.env.VITE_BASE_EPT + "dynamic_suggestions/",
            {"keyword":keyword},
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return resp?.data?.suggestions
    } catch (e) {
        console.log(e);
    }
};

export {getSuggestion} 