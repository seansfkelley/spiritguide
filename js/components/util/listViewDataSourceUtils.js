import _ from 'lodash';

export function rowAndSectionIdentities(arrayOfObjectsOfArrays, rowsField) {
  const sectionIds = _.range(arrayOfObjectsOfArrays.length);
  let rowIds = [];
  arrayOfObjectsOfArrays.forEach(object => rowIds.push(_.range(object[rowsField].length)));
  return { sectionIds, rowIds };
}

export function getSectionData(arrayOfObjectsOfArrays, sectionId) {
  return arrayOfObjectsOfArrays[sectionId];
}

export function makeGetRowData(rowsField) {
  return (arrayOfObjectsOfArrays, sectionId, rowId) => arrayOfObjectsOfArrays[sectionId][rowsField][rowId];
}
