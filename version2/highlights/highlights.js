const express = require('express');
const { postHighlights, getHighlights, updateHighlightsData, deleteHighlightsData } = require('./highlights.controller');

const highlightRouter = express.Router();

// post highlight
highlightRouter.post('/post_highlight', postHighlights)
// get highlight
highlightRouter.get('/get_highlight', getHighlights)
// edit highlight
highlightRouter.put('/edit_highlight/:highlightId', updateHighlightsData)
// delete highlight
highlightRouter.delete('/delete_highlight/:highlightId', deleteHighlightsData)

module.exports={
    highlightRouter
}