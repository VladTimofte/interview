// Function to generate random number 
export function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

// Function that return the age
export function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}