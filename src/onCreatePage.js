import defaultOptions from './defaultOptions';
import { getNewPage } from './getNewPage';
import { isInPagesPaths } from 'ptz-i18n';

/**
 * Add context.slug and .langKey for react props
 * @param {*} args args
 * @param {*} pluginOptions plugin options from gatsby-config.js
 * @returns {Promise} Promise
 */
const onCreatePage = ({ page, actions }, pluginOptions) => {
  if (page.context.slug) {
    return 'Skipping page already has slug'; // Allow only pages without slug
  }

  const options = {
    ...defaultOptions,
    ...pluginOptions
  };

  return isInPagesPaths(options, page.componentPath)
    .map(isInPaths => {
      if(isInPaths === false){
        return 'Skipping page, not in pagesPaths';
      }

      const { createPage, deletePage } = actions;

      const newPage = getNewPage(page, options);

      deletePage(page);

      if (page.path === '/404.html') {
        createPage({
          ...newPage,
          path: `/404.html`
        });
      } else {
        createPage(newPage);
      }

      return 'Page created';
    })
    .mapError(error => {
      const errorMsg = 'Error gatsby-plugin-i18n onCreatePage: ' + error;
      console.log(errorMsg);
      return errorMsg;
    })
    .merge();
};

export {
  onCreatePage
};

