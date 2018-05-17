using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackToTheDrawingBoard.Models;
using Microsoft.AspNetCore.Authorization;

namespace BackToTheDrawingBoard.Controllers
{
    [Produces("application/json")]
    [Route("api/Canvas")]
    public class CanvasController : Controller
    {
        private readonly MyDBContext _context;

        public CanvasController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/Canvas
        [HttpGet]
        public IEnumerable<Canvas> GetCanvas()
        {
            return _context.Canvas;
        }

        // GET: api/Canvas/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCanvas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var canvas = await _context.Canvas.SingleOrDefaultAsync(m => m.Id == id);

            if (canvas == null)
            {
                return NotFound();
            }

            return Ok(canvas);
        }

        // PUT: api/Canvas/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCanvas([FromRoute] int id, [FromBody] Canvas canvas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != canvas.Id)
            {
                return BadRequest();
            }

            _context.Entry(canvas).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CanvasExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Canvas
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> PostCanvas([FromBody] Canvas canvas)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Canvas.Add(canvas);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCanvas", new { id = canvas.Id }, canvas);
        }

        // DELETE: api/Canvas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCanvas([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var canvas = await _context.Canvas.SingleOrDefaultAsync(m => m.Id == id);
            if (canvas == null)
            {
                return NotFound();
            }

            _context.Canvas.Remove(canvas);
            await _context.SaveChangesAsync();

            return Ok(canvas);
        }

        private bool CanvasExists(int id)
        {
            return _context.Canvas.Any(e => e.Id == id);
        }
    }
}