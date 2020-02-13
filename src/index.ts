export { Page, Site, PageFields, SiteFields } from './resolvers';
import { PageFields, SiteFields, Page, Site } from './resolvers';

export const renderPage = async (page: PageFields) => {
    return Page.from(page).render();
}   

export const renderSite = (site: SiteFields) => {
    return Site.from(site).render();
}