const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { SEARCH_BASE_URL } = require('../contstants');
const createDom = require('../utils/createDom');

const searchBaseUrl = SEARCH_BASE_URL;

const Category = require('../models/Category');

const getSearchResults = require('../services/html/getSearchResults');
const browser = require('../services/browser');

function encodeQueryData(data) {
  const ret = [];
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  return ret.join('&');
}

router.post('/', auth, async (req, res) => {
  let { searchText, searchTitle, url } = req.body;

  url = url || `${searchBaseUrl}?${encodeQueryData({ q: searchText })}`;

  const { html, currentUrl } = await browser.getHTML(url, searchTitle);
  url = currentUrl;

  const re =
    /https:\/\/www\.idealo\.de\/preisvergleich\/ProductCategory\/([0-9]+)[F]?.*/i;
  const categoryChildId = currentUrl.match(re);

  if (html.includes('konnten wir leider nicht finden'))
    return res.status(400).json({ msg: 'Nothing found, try again.' });
  if (html.includes('class="errorpage"'))
    return res.status(400).json({ msg: 'Error, please try again.' });

  if (categoryChildId) {
    const { categoryChildren } = await Category.findOne(
      {
        categoryChildren: {
          $elemMatch: { categoryChildId: categoryChildId[1] },
        },
      },
      { 'categoryChildren.$': 1 }
    );

    res.json({ categoryChild: categoryChildren[0]._id });
  } else {
    const doc = createDom(html);
    const searchCategories = await getSearchResults(doc);
    res.json({ searchCategories, url });
  }
});

module.exports = router;
