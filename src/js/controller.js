import * as model from './model.js';
import resultView from './views/resultView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView.js';
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';
import BookmarksView from './views/bookmarksView.js';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addrecipeView.js';

///////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);
    if (!id) return;
    recipeView.renderSpinner();
    // 0) update the mark
    resultView.update(model.getSearchResultPage());
    BookmarksView.update(model.state.bookMarks);
    // 1) Loading recipe
    await model.loaRecipe(id);
    // 2)Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    console.log(err);
    recipeView.renderError();
  }
};
const controlResearchResults = async function () {
  try {
    resultView.renderSpinner();
    // 1)Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search the query
    await model.loadSearchResults(query);
    // 1)render result
    // resultView.render(model.state.search.result);
    resultView.render(model.getSearchResultPage());
    // 4)pagination buuton
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1)render  New result

  resultView.render(model.getSearchResultPage(gotoPage));
  // 4)pagination buuton
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings
  model.updateServigs(newServings);
  // Update the servings in the view
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookMarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //4) update e bookmarks
  recipeView.update(model.state.recipe);
  // 3)  render a bookmarks
  BookmarksView.render(model.state.bookMarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // render spinner
    addrecipeView.renderSpinner();
    // console.log(newRecipe);
    // upload data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    // Render recipe
    recipeView.render(model.state.recipe);
    // success Message
    addrecipeView.renderGreatMessage();
    // render bookmarks view
    bookmarksView.render(model.state.bookMarks);
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form window
    setTimeout(function () {
      addrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('🔥', err);
    addrecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlResearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  addrecipeView.addHandlerUpload(controlAddRecipe);
};
init();
