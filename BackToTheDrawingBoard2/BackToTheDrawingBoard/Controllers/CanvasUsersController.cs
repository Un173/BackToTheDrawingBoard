using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackToTheDrawingBoard.Models;

namespace BackToTheDrawingBoard.Controllers
{
    [Produces("application/json")]
    [Route("api/CanvasUsers")]
    public class CanvasUsersController : Controller
    {
        private readonly MyDBContext _context;

        public CanvasUsersController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/CanvasUsers
        [HttpGet]
        public IEnumerable<CanvasUser> GetCanvasUser()
        {
            return _context.CanvasUser;
        }

        // GET: api/CanvasUsers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCanvasUser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var canvasUser = await _context.CanvasUser.SingleOrDefaultAsync(m => m.Id == id);

            if (canvasUser == null)
            {
                return NotFound();
            }

            return Ok(canvasUser);
        }

        // PUT: api/CanvasUsers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCanvasUser([FromRoute] int id, [FromBody] CanvasUser canvasUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != canvasUser.Id)
            {
                return BadRequest();
            }

            _context.Entry(canvasUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CanvasUserExists(id))
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

        // POST: api/CanvasUsers
        [HttpPost]
        public async Task<IActionResult> PostCanvasUser([FromBody] CanvasUser canvasUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CanvasUser.Add(canvasUser);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCanvasUser", new { id = canvasUser.Id }, canvasUser);
        }

        // DELETE: api/CanvasUsers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCanvasUser([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var canvasUser = await _context.CanvasUser.SingleOrDefaultAsync(m => m.Id == id);
            if (canvasUser == null)
            {
                return NotFound();
            }

            _context.CanvasUser.Remove(canvasUser);
            await _context.SaveChangesAsync();

            return Ok(canvasUser);
        }

        private bool CanvasUserExists(int id)
        {
            return _context.CanvasUser.Any(e => e.Id == id);
        }
    }
}