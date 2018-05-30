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
    //[Route("api/FavoriteCanvases")]
    public class FavoriteCanvasesController : Controller
    {
        private readonly MyDBContext _context;

        public FavoriteCanvasesController(MyDBContext context)
        {
            _context = context;
        }

        // GET: api/FavoriteCanvases
        [HttpGet]
        public IEnumerable<FavoriteCanvases> GetFavoriteCanvases()
        {
            return _context.FavoriteCanvases;
        }

        // GET: api/FavoriteCanvases/5
        
        [Route("api/FavoriteCanvases/{id}")]
        //[HttpGet("{id}")]
        public async Task<IActionResult> GetFavoriteCanvases([FromRoute] string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            //var favoriteCanvases = await _context.FavoriteCanvases.SingleOrDefaultAsync(m => m.Id == id);
            var favoriteCanvases = _context.FavoriteCanvases.Where(c => c.UserId == id).Select(c => new {c.CanvasId});
            if (favoriteCanvases == null)
            {
                return NotFound();
            }

            return Ok(favoriteCanvases);
        }

        
        // PUT: api/FavoriteCanvases/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFavoriteCanvases([FromRoute] int id, [FromBody] FavoriteCanvases favoriteCanvases)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != favoriteCanvases.Id)
            {
                return BadRequest();
            }

            _context.Entry(favoriteCanvases).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FavoriteCanvasesExists(id))
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

        // POST: api/FavoriteCanvases
        [Route("api/FavoriteCanvases/")]
        [HttpPost]
        public async Task<IActionResult> PostFavoriteCanvases([FromBody] FavoriteCanvases favoriteCanvases)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var canvas = _context.FavoriteCanvases.Where(c => c.UserId == favoriteCanvases.UserId && c.CanvasId == favoriteCanvases.CanvasId).Count();
            if (canvas == 0)
            {
                _context.FavoriteCanvases.Add(favoriteCanvases);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetFavoriteCanvases", new { id = favoriteCanvases.Id }, favoriteCanvases);
            }
            return Ok();
        }

        [Route("api/FavoriteCanvases/")]
        [HttpDelete]
        public async Task<IActionResult> DeleteFavoriteCanvases([FromBody] FavoriteCanvases favoriteCanvases)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //var canvas = _context.FavoriteCanvases.Where(c => c.UserId == favoriteCanvases.UserId && c.CanvasId == favoriteCanvases.CanvasId).Count();
            var canvas = await _context.FavoriteCanvases.SingleOrDefaultAsync(m => m.UserId == favoriteCanvases.UserId&& m.CanvasId == favoriteCanvases.CanvasId);
          
                if (canvas == null)
                {
                    return NotFound();
                }

                _context.FavoriteCanvases.Remove(canvas);
                await _context.SaveChangesAsync();

                return Ok(canvas);
            
           
        }

        private bool FavoriteCanvasesExists(int id)
        {
            return _context.FavoriteCanvases.Any(e => e.Id == id);
        }
    }
}