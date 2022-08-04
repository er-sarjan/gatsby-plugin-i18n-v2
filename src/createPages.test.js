import { createPages } from './createPages';
import * as assert from 'ptz-assert';

describe('createPages', () => {
  it('return null when no options.markdownRemark', () => {
    const graphql = () => null;
    const actions = {
      createPage: () => null
    };
    const pluginOptions = {

    };

    const result = createPages({ graphql, actions }, pluginOptions);
    assert.notOk(result);
  });

  it('create markdown pages', (done) => {
    const graphql = () => Promise.resolve({
      data: {
        allMarkdownRemark: {
          edges: [
            {
              'node': {
                'fields': {
                  'slug': '/pt/blog/functional-programming/examples/',
                  'langKey': 'pt'
                }
              }
            },
            {
              'node': {
                'fields': {
                  'slug': '/en/blog/functional-programming/examples/',
                  'langKey': 'en'
                }
              }
            },
            {
              'node': {
                'fields': null // Simulate contentful nodes https://github.com/angeloocana/gatsby-plugin-i18n/issues/16
              }
            }
          ]
        }
      }
    });

    let pagesCreated = 0;
    const actions = {
      createPage: () => { pagesCreated += 1; }
    };
    const pluginOptions = {
      markdownRemark: {
        postPage: 'src/templates/blog-post.js',
        query: `
        {
            allMarkdownRemark {
                edges {
                node {
                    fields {
                    slug,
                    langKey
                    }
                }
                }
            }
        }
        `
      }
    };

    createPages({ graphql, actions }, pluginOptions)
      .then(() => {
        assert.equal(pagesCreated, 2);
        done();
      });
  });

  it('result.errors', (done) => {
    const graphql = () => Promise.resolve({
      errors: ['error test']
    });

    const actions = {
      createPage: () => null
    };

    const pluginOptions = {
      markdownRemark: {
        postPage: 'src/templates/blog-post.js',
        query: `
        {
            allMarkdownRemark {
                edges {
                node {
                    fields {
                    slug,
                    langKey
                    }
                }
                }
            }
        }
        `
      }
    };

    createPages({ graphql, actions }, pluginOptions)
      .catch(() => done());
  });
});
