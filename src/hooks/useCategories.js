async function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/student-data/categories.json');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return categories;
}