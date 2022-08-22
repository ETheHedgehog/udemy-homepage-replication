let createCourseImage = (image) => {
    let courseImg = document.createElement('img');
    courseImg.setAttribute('src', image);
    courseImg.classList.add('course-img');
    return courseImg;
}

let createCourseTitle = (title) => {
    let courseTitle = document.createElement('a');
    courseTitle.setAttribute('href', '');
    courseTitle.classList.add('course-title');
    courseTitle.textContent = title;
    return courseTitle;
}

let createCourseAuthor = (author) => {
    let courseAuthor = document.createElement('p');
    courseAuthor.classList.add('course-author');
    courseAuthor.textContent = author;
    return courseAuthor;
}

let createCourseStars = (rating) => {
    let courseStars = document.createElement('span');
    courseStars.classList.add('rating');
    let numFullStars = parseInt(rating);
    let numHalfStars = (rating - numFullStars) >= 0.4 ? 1 : 0;
    let numEmptyStars = 5 - numFullStars - numHalfStars;
    for (let i = 0; i < numFullStars; i++) {
        let fullStar = document.createElement('i');
        fullStar.classList.add('fa-solid');
        fullStar.classList.add('fa-star');
        courseStars.appendChild(fullStar);
    }
    for (let i = 0; i < numHalfStars; i++) {
        let halfStar = document.createElement('i');
        halfStar.classList.add('fa-regular');
        halfStar.classList.add('fa-star-half-stroke');
        courseStars.appendChild(halfStar);
    }
    for (let i = 0; i < numEmptyStars; i++) {
        let emptyStar = document.createElement('i');
        emptyStar.classList.add('fa-regular');
        emptyStar.classList.add('fa-star');
        courseStars.appendChild(emptyStar);
    }
    return courseStars;
}

let createCourseRatings = (rating, ratingNumber) => {
    let ratingContainer = document.createElement('div');
    let courseRating = document.createElement('span');
    courseRating.classList.add('rating');
    courseRating.textContent = rating;
    ratingContainer.appendChild(courseRating);
    let courseStars = createCourseStars(rating);
    ratingContainer.appendChild(courseStars);
    let courseRatings = document.createElement('span');
    courseRatings.classList.add('rating-numbers');
    courseRatings.textContent = '(' + ratingNumber.toLocaleString('en-US') + ')';
    ratingContainer.appendChild(courseRatings);
    return ratingContainer;
}

let createCoursePrice = (price) => {
    let coursePrice = document.createElement('div');
    coursePrice.classList.add('course-price');
    coursePrice.textContent = '$' + price.toString();
    return coursePrice;
}

let createCourseCard = (element) => {
    let courseCard = document.createElement('div');
    courseCard.classList.add('course-card');
    let courseImg = createCourseImage(element.image);
    courseCard.appendChild(courseImg);
    let courseTitle = createCourseTitle(element.title);
    courseCard.appendChild(courseTitle);
    let courseAuthor = createCourseAuthor(element.author);
    courseCard.appendChild(courseAuthor);
    let ratingContainer = createCourseRatings(element.rating, element.ratings);
    courseCard.appendChild(ratingContainer);
    let coursePrice = createCoursePrice(element.price);
    courseCard.appendChild(coursePrice);
    return courseCard;
}

const getCourses = async () => {
    let response = await fetch('http://localhost:3000/courses');
    let json = await response.json();
    return json;
}

let displayCourses = async () => {
    let coursesList = await getCourses();
    let sectionBox = document.querySelector('.section-box');
    let courseContainer = document.createElement('div');
    courseContainer.classList.add('course-container');
    coursesList.forEach(element => {
        let courseCard = createCourseCard(element);
        courseContainer.appendChild(courseCard);
    });
    sectionBox.appendChild(courseContainer);
}

let searchCourses = async (searchValue) => {
    let coursesList = await getCourses();
    let sectionBox = document.querySelector('.section-box');
    let courseContainer = document.querySelector('.course-container');
    courseContainer.remove();
    courseContainer = document.createElement('div');
    courseContainer.classList.add('course-container');
    coursesList.forEach(element => {
        let title = element.title.toLowerCase();
        if (title.includes(searchValue)) {
            let courseCard = createCourseCard(element);
            courseContainer.appendChild(courseCard);
        }
    });
    sectionBox.appendChild(courseContainer);
}

displayCourses();

let searchButton = document.querySelector('.search-btn');
searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    let searchQuery = document.querySelector('.search-input').value.toLowerCase();
    searchCourses(searchQuery);
});
