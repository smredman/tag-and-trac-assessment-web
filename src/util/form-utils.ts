export const set = (name: string, setFormState) => {
    return ({ target: { value } }) => {
      setFormState(oldValues => ({...oldValues, [name]: value }));
    }
};