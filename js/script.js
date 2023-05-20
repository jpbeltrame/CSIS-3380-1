const SAMPLE_SIZE = 53;
const API_URL = "https://randomuser.me/api/?results=" + SAMPLE_SIZE;
const PAGE_SIZE = 10;

class Paginator {
    activePage = 1
    pageSize = 10;
    list = [];

    constructor(pageSize, list, autoLoad = true) {
        this.pageSize = pageSize;
        this.list = list;

        if (autoLoad) {
            this.renderTotal();
            this.renderPage(1);
        }
    }

    get numberOfPages() {
        return Math.ceil(this.list.length / this.pageSize);
    }

    get total() {
        return this.list.length;
    }

    getItensByPageNumber(pageNumber) {
        let start = (pageNumber - 1) * this.pageSize;
        let end = start + this.pageSize;
        return [... this.list.slice(start, end)];
    }

    getPageTemplate(pageNumber) {
        return this.getItensByPageNumber(pageNumber).reduce((a, b) => a + b.htmlTemplate, "");

    }

    renderPagination() {
        let html = "";
        for (let i = 1; i <= this.numberOfPages; i++) {
            let activeClass = i == this.activePage ? "class='active'" : "";
            html += `<li><a ${activeClass} href="javascript:paginator.renderPage(${i})">${i}</a></li>`;
        }

        document.getElementById('contact-list__pagination').innerHTML = html;
    }

    renderPage(pageNumber) {
        this.activePage = pageNumber;
        this.renderPagination();
        document.getElementById('contact-list__body').innerHTML = this.getPageTemplate(pageNumber);
    }

    renderTotal() {
        document.getElementById('page_total').innerHTML = "Total: " + this.total;
    }
}

class PaginatorItem {

    constructor() { }

    get htmlTemplate() {
        return '';
    }
}

class Contact extends PaginatorItem {
    fullName;
    title;
    email;
    profilePicture;
    joined;
    pos;

    constructor(contactInfo, position) {
        super();
        this.fullName = contactInfo.name.first + " " + contactInfo.name.last;
        this.title = contactInfo.name.title;
        this.email = contactInfo.email;
        this.profilePicture = contactInfo.picture.thumbnail;
        this.joined = new Date(contactInfo.registered.date);
        this.pos = position;
    }

    get joinedDate() {
        return this.joined.toLocaleDateString();
    }

    get htmlTemplate() {
        return `
        <li class="contact-item cf">
            <div class="contact-details">
                <img class="avatar" src="${this.profilePicture}">
                <h3>#${this.pos} - ${this.title} ${this.fullName}</h3>
                <span class="email">${this.email}</span>
            </div>
            <div class="joined-details">
                <span class="date">Joined ${this.joinedDate}</span>
           </div>
        </li>
        `;
    }
}

var paginator;

async function init() {
    const request = await fetch(API_URL);
    const response = await request.json();

    const contacts = [];
    let i = 1;
    for (let contactInfo of response.results) {
        contacts.push(new Contact(contactInfo, i))
        i++;
    }

    paginator = new Paginator(
        PAGE_SIZE,
        contacts
    );
}

init();