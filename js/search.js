const createCourseImage = (image) => {
    let courseImg = document.createElement('img');
    courseImg.setAttribute('src', image);
    courseImg.classList.add('course-img');
    return courseImg;
};

const createCourseTitle = (title) => {
    let courseTitle = document.createElement('a');
    courseTitle.setAttribute('href', '');
    courseTitle.classList.add('course-title');
    courseTitle.textContent = title;
    return courseTitle;
};

const createCourseAuthor = (author) => {
    let courseAuthor = document.createElement('p');
    courseAuthor.classList.add('course-author');
    courseAuthor.textContent = author;
    return courseAuthor;
};

const createCourseStars = (rating) => {
    let courseStars = document.createElement('span');
    courseStars.classList.add('rating');
    let numFullStars = parseInt(rating);
    let numHalfStars = rating - numFullStars >= 0.4 ? 1 : 0;
    let numEmptyStars = 5 - numFullStars - numHalfStars;
    for (let i = 0; i < numFullStars; i++) {
        let fullStar = document.createElement('i');
        fullStar.classList.add('fa-solid');
        fullStar.classList.add('fa-star');
        courseStars.appendChild(fullStar);
    }
    let halfStar = document.createElement('i');
    halfStar.classList.add('fa-regular');
    halfStar.classList.add('fa-star-half-stroke');
    numHalfStars === 1 ? courseStars.appendChild(halfStar) : halfStar.remove();
    for (let i = 0; i < numEmptyStars; i++) {
        let emptyStar = document.createElement('i');
        emptyStar.classList.add('fa-regular');
        emptyStar.classList.add('fa-star');
        courseStars.appendChild(emptyStar);
    }
    return courseStars;
};

const createCourseRatings = (rating, ratingNumber) => {
    let ratingContainer = document.createElement('div');
    let courseRating = document.createElement('span');
    courseRating.classList.add('rating');
    courseRating.textContent = rating;
    ratingContainer.appendChild(courseRating);
    let courseStars = createCourseStars(rating);
    ratingContainer.appendChild(courseStars);
    let courseRatings = document.createElement('span');
    courseRatings.classList.add('rating-numbers');
    courseRatings.textContent = `(${ratingNumber.toLocaleString('en-US')})`;
    ratingContainer.appendChild(courseRatings);
    return ratingContainer;
};

const createCoursePrice = (price) => {
    let coursePrice = document.createElement('div');
    coursePrice.classList.add('course-price');
    coursePrice.textContent = `$${price.toString()}`;
    return coursePrice;
};

const createCourseCard = (element) => {
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
};

const getCourses = async () => {
    let response = await fetch('http://localhost:3000/info');
    let json = await response.json();
    return json;
};

const sliders = {
    python: false,
    excel: false,
    'web-development': false,
    javascript: false,
    'data-science': false,
    aws: false,
    drawing: false,
};

const createSlider = (category) => {
    let slider = tns({
        controls: true,
        fixedWidth: 252.8,
        edgePadding: 24,
        container: `#${category}-courses`,
        prevButton: `.${category}-prev`,
        nextButton: `.${category}-next`,
        nav: false,
        items: 1,
        responsive: {
            586: {
                items: 2,
                slideBy: 1,
            },
            768: {
                items: 3,
                slideBy: 2,
            },
            1200: {
                items: 4,
                slideBy: 3,
            },
            1400: {
                items: 5,
                slideBy: 4,
            },
        },
        slideBy: 1,
        rewind: true,
        swipeAngle: false,
        speed: 400,
    });
    return slider;
};

const fillCourseByCategory = (elements, category) => {
    let courseTab = document.getElementById(`${category}-tab-pane`);
    let sectionBox = courseTab.querySelector('.section-box');
    let courseContainer = sectionBox.querySelector('.course-container');
    if (sliders[category]) {
        sliders[category].destroy();
    }
    let courseSlider = document.getElementById(`${category}-courses`);
    courseSlider.remove();
    courseSlider = document.createElement('div');
    courseSlider.id = `${category}-courses`;
    elements.forEach((element) => {
        if (element.category === category) {
            let courseCard = createCourseCard(element);
            courseSlider.appendChild(courseCard);
        }
    });
    courseContainer.appendChild(courseSlider);
    sectionBox.appendChild(courseContainer);
    courseTab.appendChild(sectionBox);
    sliders[category] = createSlider(category);
};

const displayCourses = async () => {
    let info = await getCourses();
    info.categories.forEach((category) => {
        fillCourseByCategory(info.courses, category);
    });
};

const searchCourses = async (searchValue) => {
    let info = await getCourses();
    let searchResults = [];
    info.courses.forEach((element) => {
        let title = element.title.toLowerCase();
        if (title.includes(searchValue)) {
            searchResults.push(element);
        }
    });
    info.categories.forEach((category) => {
        fillCourseByCategory(searchResults, category);
    });
};

displayCourses();

let searchButton = document.querySelector('.search-btn');
searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    let searchQuery = document
        .querySelector('.search-input')
        .value.toLowerCase();
    searchCourses(searchQuery);
});
