using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Presistent_Mini_App.Data;
using Presistent_Mini_App.Models;

namespace Presistent_Mini_App.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Note>>> GetNotes()
        {
            return await _context.Notes
                .OrderByDescending(n => n.IsPinned)
                .ThenByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        // GET: api/notes/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Note>> GetNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            return note;
        }

        // POST: api/notes
        [HttpPost]
        public async Task<ActionResult<Note>> CreateNote(Note note)
        {
            note.CreatedAt = DateTime.Now;
            note.UpdatedAt = DateTime.Now;

            _context.Notes.Add(note);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNote), new { id = note.Id }, note);
        }

        // PUT: api/notes/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNote(int id, Note note)
        {
            var existing = await _context.Notes.FindAsync(id);

            if (existing == null)
                return NotFound();

            existing.Title = note.Title;
            existing.Content = note.Content;
            existing.IsPinned = note.IsPinned;
            existing.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/notes/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            _context.Notes.Remove(note);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PATCH: api/notes/1/pin
        [HttpPatch("{id}/pin")]
        public async Task<IActionResult> TogglePin(int id)
        {
            var note = await _context.Notes.FindAsync(id);

            if (note == null)
                return NotFound();

            note.IsPinned = !note.IsPinned;
            note.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(note);
        }
    }
}