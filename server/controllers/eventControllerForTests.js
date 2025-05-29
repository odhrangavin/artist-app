function createEventController(db) {
  const getEvents = (req, res) => {
    const validColumns = ['title', 'event_time', 'location'];
    const conditions = [];
    const params = [];

    for (const column of validColumns) {
      if (req.query[column]) {
        conditions.push(`${column} LIKE ?`);
        params.push(`%${req.query[column].toLowerCase()}%`);
      }
    }

    const sql = conditions.length > 0
      ? `SELECT * FROM events WHERE ${conditions.join(' OR ')}`
      : `SELECT * FROM events`;

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ query: req.query, results: rows });
    });
  };

  const createEvent = (req, res) => {
    const { title, description, image_url, event_time, location, user_id } = req.body;
    const created_at = new Date().toISOString();

    const sql = `
      INSERT INTO events (title, description, image_url, event_time, location, user_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql,
      [title, description, image_url, event_time, location, user_id, created_at],
      function (err) {
        if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(this); 
      }
    );
  };

  return {
    getEvents,
    createEvent,
  };
}

module.exports = createEventController;
