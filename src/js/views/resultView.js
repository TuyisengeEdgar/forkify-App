import view from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';
class resultView extends view {
  _parentElement = document.querySelector('.results');
  _messageError = 'No recipe found for your query! please try again :)';
  _messsage = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultView();
