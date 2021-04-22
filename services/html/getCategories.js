const _ = require("lodash")
const axios = require('axios');
const createDom = require("../../utils/createDom")
const xpath = require('xpath')
const browser = require("../browser")
const Category = require("../../models/Category")


const getCategory = async () => {
    await Category.deleteMany()

    const data = await browser.getHTML("https://www.idealo.de/preisvergleich/Sitemap.html")
    const doc = createDom(data)

    //Get Category Links
    const categoryLinksNodes = xpath.select(`//*[contains(@class, "fl-right")]`, doc)
    const categories = categoryLinksNodes.map(categoryLink => {
        const link = xpath.select1(`./@href`, categoryLink)
        const categoryId = link.value.substring(link.value.indexOf("#") + 1)
        return { categoryId, link: `https://www.idealo.de/preisvergleich/${link.value}` }
    })

    //Get Parent Category & Title & Link
    categories.forEach(async ({ categoryId, link }) => {
        const data = await browser.getHTML(link)
        const doc = createDom(data)

        const categoryParentNode = xpath.select1(`.//*[@id="${categoryId}"]`, doc)
        const categoryChildNode = xpath.select1(`.//*[@id="${categoryId}"]/following-sibling::div`, doc)
        const categoryChildLinkNodes = xpath.select(`.//*[contains(@class, "link-3")]`, categoryChildNode)

        //Get Category Child Name & Link
        const children = categoryChildLinkNodes.map(categoryLink => {
            const link = xpath.select1('./@href', categoryLink)
            const categoryChildId = link.value.replace(/[^0-9]/g,'');
            return { categoryChildId, categoryChild: categoryLink.firstChild.data }
        })
        const categoryChildren = _.orderBy(children, ["category"])

        const category = categoryParentNode.firstChild.data.trim().replace("&nbsp;–&nbsp;Alle Kategorien", "")

        const newCategory = new Category({ categoryId, category, categoryChildren })
        await newCategory.save(newCategory);

        // fs.writeFileSync("categories.json", JSON.stringify(category));
    })
}

module.exports = getCategory