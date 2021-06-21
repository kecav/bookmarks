const bgBlur = document.getElementById("background-blur");
const deleteBtn = document.getElementById("delete-Btn");
const closeBtn = document.getElementById("close-Btn");
const addBtn = document.getElementById("add-bookmark-btn");
const bmName = document.getElementById("bookmark-name");
const bmUrl = document.getElementById("bookmark-url");
const submitBtn = document.getElementById("submitBtn");
const addForm = document.getElementById("add-bookmark-form");
const bookmarkContainer = document.querySelector('.bookmark-items');
const formMessage = document.getElementById("form-message");

//An array to store all bookmarks
let bookmarks = [];

// Show form for adding new Bookmark
function showAddBookmark() {
    formMessage.textContent = "";
    bgBlur.style.display = "flex";
    bmName.focus();
}

// Hide form to see bookmrks
function closeBookmarkForm() {
    bgBlur.style.display = "none";
}

// Url validation checker
function urlValidator(url) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}

//Add bookmark from form
function storeBookmark(e) {
    e.preventDefault();

    // Getting name and url from input
    const webName = bmName.value;
    let webUrl = bmUrl.value;

    //If https not included
    if (!webUrl.includes('http://', 'https://')) {
        webUrl = `https://${webUrl}`;
    }

    // If one value not entered
    if (!webName || !webUrl) {
        alert("Enter both values !");
        formMessage.textContent = "Try Again!";
        return;
    } else if (!urlValidator(webUrl)) {
        // If entred url doesnt pass url validation check
        alert("Invalid Url, Please enter a valid url.");
        formMessage.textContent = "Try Again!";
        return;
    }

    // Adding name and url to an object
    const bookmark = {
        name: webName,
        url: webUrl
    }

    // Pushing bookmark object to bookmarks array
    bookmarks.push(bookmark);

    // Pushing bookmarks array to localStorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    addForm.reset();

    //Success message
    formMessage.textContent = "Added Successfully !";

    fetchBookmarks();
    // buildBookmarks();
}

// fetch bookmarks from localStorage an array
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [{
            name: "Google",
            url: "https://google.com"
        }];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    console.log(bookmarks);
    buildBookmarks();
}


function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1);
        }
    });

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    buildBookmarks();
}

//Building bookmarks DOM
function buildBookmarks() {
    // Clearing before showing new bookmarks
    bookmarkContainer.textContent = "";

    //Build items
    bookmarks.forEach((bookmark) => {

        const { name, url } = bookmark;
        const item = document.createElement('div');
        item.classList.add('bookmark-item');
        item.setAttribute('title', name);

        //Close icon
        const closeIcon = document.createElement('p');
        closeIcon.textContent = "X";
        // closeIcon.classList.add('fas', 'fa-window-close');
        closeIcon.setAttribute('id', 'delete-Btn');
        closeIcon.setAttribute('title', 'delete this bookmark');
        closeIcon.setAttribute('onClick', `deleteBookmark('${url}')`);

        // bookmark icon
        const icon = document.createElement('img');
        icon.setAttribute('id', 'bookmark-logo');
        icon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        // icon.setAttribute('src', 'https://www.heropatterns.com/img/avatar.png');
        icon.setAttribute('alt', 'Bookmark');

        // anchor url
        const anchor = document.createElement('a');
        anchor.setAttribute('href', `${url}`);
        anchor.setAttribute('target', '_blank')
        anchor.textContent = name;

        item.append(closeIcon, icon, anchor);
        bookmarkContainer.appendChild(item);
    });
}

addBtn.addEventListener('click', showAddBookmark);
closeBtn.addEventListener('click', closeBookmarkForm);
window.addEventListener('click', (e) => (e.target === bgBlur ? closeBookmarkForm() : ''));
addForm.addEventListener('submit', storeBookmark);

fetchBookmarks();
buildBookmarks();