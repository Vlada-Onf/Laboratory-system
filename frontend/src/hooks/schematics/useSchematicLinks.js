import { useState, useCallback, useMemo } from 'react';

export const useSchematicLinks = (initialSchematic) => {
  const getLinksFromDb = useCallback((schematic) => {
    if (schematic?.additionalLinks) {
      if (Array.isArray(schematic.additionalLinks)) return schematic.additionalLinks;
      if (typeof schematic.additionalLinks === 'string') {
        return schematic.additionalLinks
          .split(',')
          .map(link => link.trim())
          .filter(Boolean);
      }
    } else if (schematic?.links && Array.isArray(schematic.links)) {
      return schematic.links;
    }
    return [];
  }, []);

  const initialLinks = useMemo(() => getLinksFromDb(initialSchematic), [initialSchematic, getLinksFromDb]);

  const [links, setLinks] = useState(initialLinks);
  const [linkInput, setLinkInput] = useState('');

  const addLink = useCallback(() => {
    const newLink = linkInput.trim();
    if (newLink && !links.includes(newLink)) {
      setLinks(prev => [...prev, newLink]);
      setLinkInput('');
    }
  }, [linkInput, links]);

  const removeLink = useCallback((linkToRemove) => {
    setLinks(prev => prev.filter(link => link !== linkToRemove));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLink();
    }
  }, [addLink]);

  const reset = useCallback(() => {
    setLinks(initialLinks);
    setLinkInput('');
  }, [initialLinks]);

  const linksString = useMemo(() => links.join(','), [links]);
  const hasLinks = links.length > 0;

  return {
    links,
    linkInput,
    setLinkInput,
    addLink,
    removeLink,
    handleKeyPress,
    reset,
    linksString,
    hasLinks,
    getLinksFromDb
  };
};
