// Used for handling input changes in both SignIn and SignUp components to avoid code duplication
function inputChangeHandler<T>(
    setState: React.Dispatch<React.SetStateAction<T>>
) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
}


export { inputChangeHandler };