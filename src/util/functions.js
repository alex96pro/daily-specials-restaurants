
export function checkMealEdit(mealForEdit, meals, setMessages) {
    mealForEdit.name = mealForEdit.name.trim();
    if(mealForEdit.name.length === 0){
        setMessages({description:'', price:'', tags:'', name:'Name is required', category:''});
        return false;
    }
    for(let i = 0; i < meals.length; i++){
        if(meals[i].name === mealForEdit.name && meals[i].mealId !== mealForEdit.mealId){
            setMessages({description:'', price:'', tags:'', name:'Meal with that name already exists', category:''});
            return false;
        }
    }
    mealForEdit.description = mealForEdit.description.trim();
    if(mealForEdit.description.length < 20){
        setMessages({description:'Descriptions must have at least 20 characters', price:'', tags:'', name:'', category:''});
        return false;
    }
    if(mealForEdit.description.length > 200){
        setMessages({name:'', tags:'', price:'', description:`Descriptions are limited to 200 characters, you have ${mealForEdit.description.length} characters`, category:''});
        return false;
    }
    if(mealForEdit.price <= 0){
        setMessages({name:'', description:'', tags:'', price:`Meal price must be higher than 0`, category:''});
        return false;
    }
    
    if(!mealForEdit.category){
        setMessages({name:'', description:'', tags:'', price:``, category:'Category is required'});
        return false;
    }
    setMessages({name:'', description:'', tags:'', price:'', category:''});
    return true;
}